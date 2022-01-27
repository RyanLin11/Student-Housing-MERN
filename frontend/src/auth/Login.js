import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { useState } from 'react';
import axios from 'axios';

const userSchema = yup.object({
    username: yup.string().min(3, 'Invalid Username').required('Username required'),
    password: yup.string().min(6, 'Invalid Password').required('Password required'),
});

function Login (props) {
    const [ServerValidationErrors, setServerValidationErrors] = useState(null);

    const { handleSubmit, control, formState: {errors} } = useForm({
        resolver: yupResolver(userSchema),
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const user = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, data);
            setServerValidationErrors(null);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                setServerValidationErrors(error.response.data);
            }
        }
    };

    return (
        <Form validated={false} onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId='username'>
                <Form.Label>Username</Form.Label>
                <Controller
                    name='username'
                    control={control}
                    render={({field}) => <Form.Control {...field} type='text' placeholder='Enter Username' isInvalid={errors.username || ServerValidationErrors?.username?.msg}/>}
                />
                <Form.Control.Feedback type='invalid'>{errors.username?.message || ServerValidationErrors?.username?.msg}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId='password'>
                <Form.Label>Password</Form.Label>
                <Controller
                    name='password'
                    control={control}
                    render={({field}) => <Form.Control {...field} type='password' placeholder='Enter Password' isInvalid={errors.password || ServerValidationErrors?.password?.msg}/>}
                />
                <Form.Control.Feedback type='invalid'>{errors.password?.message || ServerValidationErrors?.password?.msg}</Form.Control.Feedback>
            </Form.Group>
            <Button type='submit'>Login</Button>
        </Form>
    )
}

export default Login;