FROM node:18

# Cài Python + pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv build-essential

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Cài Python packages với flag --break-system-packages
RUN pip3 install --break-system-packages pandas openpyxl pymongo

COPY . .

CMD ["node", "server.js"]
