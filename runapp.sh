#!/bin/bash

get_current_ip() {
    # Get the primary network interface
    local interface=$(ip route | grep '^default' | awk '{print $5}' | head -n 1)

    # Get the IP address associated with the primary interface
    local ip_address=$(ip -4 addr show "$interface" | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

    echo "$ip_address"
}



setup_env_variables() {
    # Environment variables when building the frontend.
    local CURRENT_IP=$(get_current_ip)
    export VITE_API_URL="http://${CURRENT_IP}:3000"

    echo "apiurl: '$VITE_API_URL'"
}


check_and_install_yq() {
    if ! command -v yq &> /dev/null; then
        echo "'yq' could not be found. Attempting to install..."

        VERSION="v4.35.2"
        BINARY="yq_linux_arm64"

        wget https://github.com/mikefarah/yq/releases/download/${VERSION}/${BINARY}.tar.gz -O - |\
        tar xz
        sudo mv ${BINARY} /usr/bin/yq

        # Check if 'yq' is successfully installed
        if command -v yq &> /dev/null; then
            echo "'yq' successfully installed."
            return 0
        else
            echo "Installation failed. Please install 'yq' manually."
            return 1
        fi
    else
        echo "'yq' is already installed."
        return 0
    fi
}

install_nginx_if_not_installed() {
    # Check if Nginx is installed by checking the exit status of dpkg-query
    if ! dpkg -l | grep -qw nginx; then
        echo "Nginx is not installed. Installing Nginx."

        # Update package lists
        sudo apt-get update

        # Install Nginx
        sudo apt-get install -y nginx

        # Check if Nginx service is running
        if sudo systemctl status nginx | grep -qw "active (running)"; then
            echo "Nginx has been installed and is running."
        else
            echo "Nginx has been installed but is not running. Starting Nginx."
            sudo systemctl start nginx
        fi
    else
        echo "Nginx is already installed."
    fi
}

install_nvm() {
    # NVM's loading script is usually in the home directory, or XDG_CONFIG_HOME if set.
    NVM_DIR="${XDG_CONFIG_HOME:-$HOME}/.nvm"

    # Check if the NVM directory exists
    if [ -d "$NVM_DIR" ]; then
        echo "NVM directory found. Assuming NVM is installed."
        # Source the NVM script to make it available in the current session
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    else
        echo "NVM is not installed. Installing NVM."
        # Install NVM. Be sure to check the latest version from the official repository.
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

        # Source the NVM script to make it available in the current session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi
}


install_node_version_20() {
    # Ensure NVM is installed
    install_nvm

    # Check if the specific version of Node is installed
    if ! nvm list 20 &> /dev/null; then
        echo "Node version 20 is not installed. Installing Node version 20."

        # Install Node version 20
        nvm install 20

        # Use the installed version
        nvm use 20
    else
        echo "Node version 20 is already installed."
    fi
}


spa_setup_nginx_files() {
    # Define the source and target directories
    SOURCE_DIR="app/dist"
    TARGET_DIR="/var/www/html"
    NGINX_CONF="config/nginx.conf" # Replace this with the path to your nginx.config if it's not in the current directory
    NGINX_CONF_DIR="/etc/nginx/sites-available"
    NGINX_CONF_ENABLED_DIR="/etc/nginx/sites-enabled"

    # Check if SOURCE_DIR exists
    if [ ! -d "$SOURCE_DIR" ]; then
        echo "The source directory '$SOURCE_DIR' does not exist. Cannot copy files."
        return 1
    fi

    # Check if NGINX_CONF exists
    if [ ! -f "$NGINX_CONF" ]; then
        echo "The Nginx configuration file '$NGINX_CONF' does not exist. Cannot copy file."
        return 1
    fi

    # Copy the SPA distribution files to the target directory
    echo "Copying files from $SOURCE_DIR to $TARGET_DIR..."
    sudo cp -R "$SOURCE_DIR"/* "$TARGET_DIR"

    # Backup the original default configuration if it exists
    if [ -f "$NGINX_CONF_DIR/default" ]; then
        echo "Backing up the original default Nginx configuration..."
        sudo mv "$NGINX_CONF_DIR/default" "$NGINX_CONF_DIR/default.backup"
    fi

    # Copy the custom Nginx configuration file to the sites-available directory
    echo "Copying Nginx configuration to $NGINX_CONF_DIR..."
    sudo cp "$NGINX_CONF" "$NGINX_CONF_DIR/default"

    # Create a symlink in sites-enabled to enable the configuration if it doesn't already exist
    if [ ! -f "$NGINX_CONF_ENABLED_DIR/default" ]; then
        echo "Creating symlink for Nginx configuration in $NGINX_CONF_ENABLED_DIR..."
        sudo ln -s "$NGINX_CONF_DIR/default" "$NGINX_CONF_ENABLED_DIR/default"
    fi

    # Test the configuration
    echo "Testing Nginx configuration..."
    sudo nginx -t

    # Restart Nginx to apply the changes
    echo "Restarting Nginx..."
    sudo systemctl restart nginx

    echo "Nginx has been setup with the new configuration and files."
}

server_npm_install(){
    # Save the current directory
    local CURRENT_DIR=$(pwd)

    # Define the app directory
    local SERVER_DIR="server"

    # Check if APP_DIR exists
    if [ ! -d "$SERVER_DIR" ]; then
        echo "The server directory '$SERVER_DIR' does not exist. Cannot run 'npm install'."
        return 1
    fi

    # Change to the app directory
    cd "$SERVER_DIR"

    # Install dependencies
    echo "Installing dependencies in the $SERVER_DIR directory..."
    if npm install; then
        echo "Dependencies installed successfully."
    else
        echo "Failed to install dependencies."
        # Change back to the original directory before returning
        cd "$CURRENT_DIR"
        return 1
    fi

    # Change back to the original directory
    cd "$CURRENT_DIR"
    echo "Build process completed and returned to the original directory."
}


spa_npm_install_build() {
    # Save the current directory
    local CURRENT_DIR=$(pwd)

    # Define the app directory
    local APP_DIR="app"

    # Check if APP_DIR exists
    if [ ! -d "$APP_DIR" ]; then
        echo "The application directory '$APP_DIR' does not exist. Cannot run 'npm install' or 'npm run build'."
        return 1
    fi

    # Change to the app directory
    cd "$APP_DIR"

    # Install dependencies
    echo "Installing dependencies in the $APP_DIR directory..."
    if npm install; then
        echo "Dependencies installed successfully."
    else
        echo "Failed to install dependencies."
        # Change back to the original directory before returning
        cd "$CURRENT_DIR"
        return 1
    fi

    # Run npm build
    echo "Running 'npm run build' in the $APP_DIR directory..."
    if npm run build; then
        echo "'npm run build' ran successfully."
    else
        echo "Failed to run 'npm run build'."
        # Change back to the original directory before returning
        cd "$CURRENT_DIR"
        return 1
    fi

    # Change back to the original directory
    cd "$CURRENT_DIR"
    echo "Build process completed and returned to the original directory."
}

server_create_service() {
    local SERVICE_NAME="ilovelamp.service"
    local SERVER_DIR="/home/ilovelamp/i-love-lamp/server"  # Make sure to provide the full path to your './server' directory
    local SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME"

    # Check if the service already exists
    # if systemctl --quiet is-active $SERVICE_NAME; then
    #     echo "The service $SERVICE_NAME is already created and running."
    #     return 0
    # elif systemctl --quiet is-enabled $SERVICE_NAME; then
    #     echo "The service $SERVICE_NAME is already created but not running. Starting the service."
    #     sudo systemctl start $SERVICE_NAME
    #     return 0
    # elif [ -f $SERVICE_FILE ]; then
    #     echo "The service file $SERVICE_FILE already exists. To re-create the service, delete the existing service file first."
    #     return 1
    # fi

    # The user and group that should run the service. Change these to your desired user and group.
    local USER="ilovelamp"
    local GROUP="ilovelamp"

    # Write the service file
    echo "Creating systemd service at $SERVICE_FILE"
    sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=Node.js Server Service
After=network.target

[Service]
Type=simple
User=$USER
Group=$GROUP
Restart=on-failure
WorkingDirectory=$SERVER_DIR
ExecStart=npm run start

[Install]
WantedBy=multi-user.target
EOF

    # Reload the systemd manager configuration
    sudo systemctl daemon-reload

    # Enable the service to start on boot
    sudo systemctl enable $SERVICE_NAME

    # Start the service
    sudo systemctl start $SERVICE_NAME

    echo "Service $SERVICE_NAME has been created and started."
}


check_and_install_yq
setup_env_variables


# Make sure everything is installed
setup_env() {
  install_node_version_20
  install_nginx_if_not_installed
  # TODO: Need to better handle Maria setup.
}

# Build and setup the SPA Application
setup_app() {
  spa_npm_install_build
  spa_setup_nginx_files
}

# Build and setup the Server application
setup_server() {
  server_npm_install
  server_create_service
}

if [ "$1" = "app" ]; then
    setup_app
elif [ "$1" = "server" ]; then
    setup_server
elif [ "$1" = "env" ]; then
    setup_env
else 
  setup_env
  setup_server
  setup_app
fi