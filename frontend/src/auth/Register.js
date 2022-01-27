import { useForm, Controller } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const userSchema = yup.object({
    username: yup.string().min(3, `Username is too short: Must be at least 3 characters long`).required('Username is required.'),
    password: yup.string().min(6, `Password is too short: Must be at least 6 characters long`).required('Password is required'),
    repassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords do not match.').required('Password Confirmation is required.'),
    email: yup.string().email('Not a valid email.').required('Email is required.'),
});

function Register() {

    const { handleSubmit, control, formState: {errors} } = useForm({
        resolver: yupResolver(userSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Controller
                    name="username"
                    control={control}
                    render={({field}) => <Form.Control type="text" {...field} placeholder="Username" isInvalid={errors.username}/>}
                />
                <Form.Text class="text-muted">
                    Must be at least 3 characters long.
                </Form.Text>
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Controller
                    name="password"
                    control={control}
                    render={({field}) => <Form.Control type="password" {...field} placeholder="Password" isInvalid={errors.password} />}
                />
                <Form.Text className="text-muted">
                    Must be at least 6 characters long.
                </Form.Text>
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="repassword">
                <Form.Label>Re-enter Password</Form.Label>
                <Controller
                    name="repassword"
                    control={control}
                    render={({field}) => <Form.Control type="password" {...field} placeholder="Re-enter Password" isInvalid={errors.repassword} />}
                />
                <Form.Control.Feedback type="invalid">{errors.repassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Controller
                    name="email"
                    control={control}
                    render={({field}) => <Form.Control type="email" {...field} placeholder="Email Address" isInvalid={errors.email} />}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button className="primary" type="submit">Register</Button>
        </Form>
    )
}

export default Register;