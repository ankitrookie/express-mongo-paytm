const zod = require("zod");

const validationSchemaSignup = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const validationSchemaSignin = zod.object({
  username: zod.string().email(),
  password: zod.string(),
})

const updateValidationSchema = zod.object({
    password: zod.string().min(6).optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

module.exports = {
  updateValidationSchema,
  validationSchemaSignup,
  validationSchemaSignin
}
