FROM mcr.microsoft.com/playwright:v1.43.0-jammy

RUN mkdir /tests
WORKDIR /tests
COPY . /tests/

RUN npm install
RUN npx playwright install
