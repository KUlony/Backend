FROM node:18.15.0
WORKDIR /Users/mild/Desktop/KUlony/Backend

COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 4000
ENV MONGOLAB_URI "mongodb+srv://mild:hIiVPHKp2gBRRbfp@cluster0.9l4v9c2.mongodb.net/?retryWrites=true&w=majority"
ENV MAIL "kulony1234@gmail.com"
ENV PASS "iocvweogiezfwmsh"
ENV SERVICE "gmail"
ENV SECRET "KUlony_SECRET"
ENTRYPOINT [ "node", "server.js" ]