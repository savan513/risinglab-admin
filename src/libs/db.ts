import mongoose from 'mongoose'

const MONGODB_URI: any = process.env.MONGODB_URI

const connectDB = async () => {
  const connectionState = mongoose.connection.readyState

  if (connectionState === 1) {
    console.log('CONNECTED')

    return mongoose.connection
  }

  if (connectionState === 2) {
    console.log('CONNECTING....')

    return mongoose.connection
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      dbName: 'rising_admin',
      bufferCommands: false
    })

    console.log('Connected')

    return connection
  } catch (error) {
    console.log('ERROR CONNECTING', error)
    throw new Error('ERROR CONNECTING')
  }
}

export default connectDB
