import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

// Create API to return list of top-sellers (route: /api/users/topsellers)
userRouter.get('/top-sellers', expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true}) // find users who are sellers
        .sort({ 'seller.rating':-1})                      // sort in descending order
        .limit(5);                                        // list first 3
    res.send(topSellers);
}));

// Create API to put dummy data to MongoDB (route: /api/users/seed)
userRouter.get('/seed', expressAsyncHandler(async(req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
}));

// Create API for user sign-in (route: /api/users/signin)
userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    // Check if email entered is valid
    if (user){ // if valid, check entered password
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                token: generateToken(user),
            });
            // return successfully if both email and password are valid
            return;
        }
    } // if not, return status 401 with Invalid message
    res.status(401).send({ message: 'Invalid email or password' });
}));

// Create API for new user register (route: /api/users/register)
userRouter.post('/register', expressAsyncHandler(async(req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
    });
}));

// Create API to get user (route: /api/users/<:id>)
userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
}));

// Create API to update user profile (route: /api/users/profile)
userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (user.isSeller){
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description = req.body.sellerDescription || user.seller.description;
        }
        if (req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(updatedUser)
        });
    }
}));

// Create API to list all users (route: /api/users/)
userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const users = await User.find({}); // get all users from database
    res.send(users);
}));

// Create API to delete user (route: /api/users/<:id>)
userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        // if (user.email === 'admin@example.com'){
            if (user.isAdmin){
                res.status(400).send({ message: 'Cannot Delete Admin User' });
            return
        }
        const deleteUser = await user.remove();
        res.send({ message: 'User Deleted', user: deleteUser });
    } else {
        res.status(404).send({ message: 'User Not Found '});
    }
}));

// Create API to update user (route: /api/users/<:id>)
userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = Boolean(req.body.isSeller);
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.send({ message: 'User Updated', user: updatedUser });
    } else {
        res.status(404).send({ message: 'User Not Found'});
    }
}));

export default userRouter;