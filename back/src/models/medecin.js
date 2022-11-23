const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Patient = require('./patient')

const medecinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

medecinSchema.virtual('patients', {
    ref: 'Patient',
    localField: '_id',
    foreignField: 'owner'
})

medecinSchema.methods.toJSON = function () {
    const medecin = this
    const medecinObject = medecin.toObject()

    delete medecinObject.password
    delete medecinObject.tokens
    delete medecinObject.avatar

    return medecinObject
}

medecinSchema.methods.generateAuthToken = async function () {
    const medecin = this
    const token = jwt.sign({ _id: medecin._id.toString() }, process.env.JWT_SECRET)

    medecin.tokens = medecin.tokens.concat({ token })
    await medecin.save()

    return token
}

medecinSchema.statics.findByCredentials = async (email, password) => {
    const medecin = await Medecin.findOne({ email })

    if (!medecin) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, medecin.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return medecin
}

// Hash the plain text password before saving
medecinSchema.pre('save', async function (next) {
    const medecin = this

    if (medecin.isModified('password')) {
        medecin.password = await bcrypt.hash(medecin.password, 8)
    }

    next()
})

// Delete medecin patients when medecin is removed
medecinSchema.pre('remove', async function (next) {
    const medecin = this
    await Patient.deleteMany({ owner: medecin._id })
    next()
})

const Medecin = mongoose.model('Medecin', medecinSchema)

module.exports = Medecin