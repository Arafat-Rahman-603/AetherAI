import { connect } from "mongoose";

const monggo_url = process.env.MONGGO_URL;

let cache = global.mongoose || { conn: null, promise: null };

if (!cache) {
    cache = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cache.conn) {
        return cache.conn;
    }
    if (!cache.promise) {
        cache.promise = connect(monggo_url!).then((con)=>{
            return con.connection;
        });
    }
    try{
        cache.conn = await cache.promise;
    }catch(error){
        console.log(error);
    }
    return cache.conn;
}