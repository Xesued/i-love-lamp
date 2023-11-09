#!/bin/bash

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

setup_nginx_files() {
    # Define the source and target directories
    SOURCE_DIR="app/dist"
    TARGET_DIR="/var/www/html"
    NGINX_CONF="config/nginx.config" # Replace this with the path to your nginx.config if it's not in the current directory
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

run_npm_install_and_build() {
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



# Make sure everything is installed
install_node_version_20
install_nginx_if_not_installed

# Build our files.
run_npm_install_and_build


# Update the files to the correct locations
setup_nginx_files

