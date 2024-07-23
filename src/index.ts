import express from "express";
import bodyParser from 'body-parser';
import { createServer } from "http";
import { Server } from "socket.io";
import { Redis } from "ioredis";
import { StatusCodes } from "http-status-codes";

import { PORT, FRONTEND_URL } from './config/server.config';
import logger from './config/logger.config';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const httpServer = createServer(app);
const redisCache = new Redis();

const io = new Server(httpServer, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    logger.info(`A User Connected: ${socket.id}`);

    socket.on("setUserId", (userId) => {
        logger.info(`Setting userId: ${userId} to ConnectionId: ${socket.id}`);
        redisCache.set(userId, socket.id);
    });

    socket.on('getConnectionId', async (userId) => {
        const connId = await redisCache.get(userId);
        logger.info(`Getting ConnectionId: ${connId} with userId: ${userId}`);
        socket.emit('connectionId', connId);
        const cache = await redisCache.keys('*');
        logger.info(`Redis Data: ${cache}`);
    });

    socket.on('disconnect', () => {
        logger.info(`User Disconnected: ${socket.id}`);
    });
});

app.post('/sendPayload', async (req, res) => {
    const { userId, payload } = req.body;
    if (!userId || !payload) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Request");
    }

    try {
        const socketId = await redisCache.get(userId);
        if (socketId) {
            io.to(socketId).emit('submissionPayloadResponse', payload);
            return res.status(StatusCodes.OK).send("Payload Sent Successfully");
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("User Not Connected");
        }
    } catch (error: any) {
        logger.error(`Error sending payload: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error sending payload");
    }
});

httpServer.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});