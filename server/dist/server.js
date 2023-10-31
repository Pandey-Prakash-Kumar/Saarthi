"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const MONGODB_URI = 'mongodb://localhost:27017/maindb';
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(MONGODB_URI, {
            maxPoolSize: 50,
            minPoolSize: 5, // Set your desired min pool size
            // Other connection pool-related options can be added here if needed
        });
        try {
            yield client.connect();
            console.log('Connected to MongoDB');
            // Your database operations go here
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
        finally {
            yield client.close();
        }
    });
}
connectToDatabase();
