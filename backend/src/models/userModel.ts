import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { Roles } from "../constants/role";
import 'dotenv/config';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        trim: true,
        lowercase: true,
        maxlength: [50, "Username can not be more than 50 characters"],
        validators: {
            validator: function (v: string) {
                return /^[a-zA-Z0-9_]+$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid username. Only alphanumeric characters and underscores are allowed.`
        }
    },
    firstName: {
        type: String,
        required: [true, "Please add a first name"],
        trim: true,
        maxlength: [50, "First name can not be more than 50 characters"],
        validators: [
            {
                validator: validator.isAlphanumeric,
                message: "First name must contain only letters and numbers"
            }
        ]
    },
    lastName: {
        type: String,
        required: [true, "Please add a last name"],
        trim: true,
        maxlength: [50, "Last name can not be more than 50 characters"],
        validators: [
            {
                validator: validator.isAlphanumeric,
                message: "Last name must contain only letters and numbers"
            }
        ]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please add a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false, // do not return password field in any query by default
        validate: [
            {
                validator: function (v: string) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(v);
                },
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            }
        ]
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (this: any, v: string) {
                return v === this.password;
            },
            message: "Passwords does not match"
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    provider: {
        type: String,
        default: 'email',
        required: true
    },
    googleId: {
        type: String,
        unique: true,
    },
    avatar: {
        type: String,
        default: 'default.jpg'
    },
    businessName: {
        type: String,
        trim: true,
        maxlength: [100, "Business name can not be more than 100 characters"],
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (v: string) {
                return validator.isMobilePhone(v, 'any', { strictMode: false });
            },
            message: (props: any) => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, "Address can not be more than 200 characters"],
    },
    city: {
        type: String,
        trim: true,
        maxlength: [100, "City can not be more than 100 characters"],
    },
    country: {
        type: String,
        trim: true,
        maxlength: [100, "Country can not be more than 100 characters"],
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: Object.values(Roles),
        default: Roles.User,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true,
    },
    refreshToken: {
        type: String,
        select: false,
    },
}, {
    timestamps: true
});

// pre-save middleware to hash password if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Remove confirmPassword field before saving
    if (this.confirmPassword) {
        this.set('confirmPassword', undefined, { strict: false });
    }
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) {
        return next();
    }
    // Set passwordChangedAt to current date minus 1 second to ensure token is created after this time
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;
