FROM mcr.microsoft.com/playwright:v1.43.0-jammy

RUN apt-get update \
    && apt-get install inetutils-ping -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app
COPY . /app/

RUN npm install -force
RUN npx playwright install
