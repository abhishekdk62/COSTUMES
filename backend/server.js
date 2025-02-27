const { config } = require('dotenv')
const express = require('express')
const connectDB = require('./config/db');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const commonRouter = require('./routes/commonRoutes');
const cors = require("cors");

const app = express()
config()

app.use(cors())
app.use(express.json())
app.use("/user",commonRouter)
app.use("/user",userRouter)
app.use("/admin",adminRouter)


const PORT=process.env.PORT||3000
connectDB()
app.listen(PORT, () => console.log(`Server started listening on  http://localhost:${PORT}`))