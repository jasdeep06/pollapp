FROM node:16.13.2

# Install dependencies
RUN apt-get update

RUN npm install expo-cli --global
RUN npm install eas-cli --global
RUN apt install -y git
RUN git clone https://github.com/jasdeep06/pollapp.git
RUN apt install -y android-sdk

ENV ANDROID_HOME="/usr/lib/android-sdk"
ENV PATH="${ANDROID_HOME}/tools:${PATH}"
ENV PATH="${ANDROID_HOME}/emulator:${PATH}"
ENV PATH="${ANDROID_HOME}/platform-tools:${PATH}"

# Download Android command line tools
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip

# Create the cmdline-tools/latest directory
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools/latest

# Unzip the command line tools directly into the cmdline-tools/latest directory
RUN unzip commandlinetools-linux-9477386_latest.zip -d ${ANDROID_HOME}/cmdline-tools/latest && \
    mv ${ANDROID_HOME}/cmdline-tools/latest/cmdline-tools/* ${ANDROID_HOME}/cmdline-tools/latest && \
    rm -r ${ANDROID_HOME}/cmdline-tools/latest/cmdline-tools

# Update PATH to include the command line tools
ENV PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${PATH}"

# Accept Android licenses
RUN yes | sdkmanager --licenses
