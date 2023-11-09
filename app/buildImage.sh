
# Copy over the engine to the build directory so that we
# can use it in the docker build context
rm -rf ./build
mkdir -p ./build/engine
cp -rf ../engine ./build



docker build .