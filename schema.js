const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),          // Title must be a string and is required
        description: Joi.string().required(),     // Description must be a string and is required
        image: Joi.object({
            url: Joi.string().uri().allow("", null).default("https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60").messages({
                "string.uri": "Image URL must be a valid URL."
            })
        }),      // Image URL can be a string, empty, or null
        price: Joi.number().required().min(0),    // Price must be a number, required, and cannot be negative
        country: Joi.string().required(),         // Country must be a string and is required
        location: Joi.string().required(),        // Location must be a string and is required
    })
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
