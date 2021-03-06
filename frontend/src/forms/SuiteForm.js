import './SuiteForm.css';
import * as SuiteVars from './Suite.js';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropertyForm from './PropertyForm';
import { useState, useEffect, Fragment } from 'react';
import FormField from './FormField';

function SuiteForm(props) {
    const [Property, setProperty] = useState("");
    const [Suites, setSuites] = useState(null);
    const [SuiteID, setSuiteID] = useState("");

    const { handleSubmit, control, formState: {errors} } = useForm({
        resolver: yupResolver(SuiteVars.SCHEMA),
        defaultValues: SuiteVars.DEFAULT_VALUES,
    })

    async function fetchSuites() {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/suites?building=${Property}`);
        const suites_data = response.data;
        setSuites(suites_data);
    }

    async function onSubmit(suite_data) {
        console.log('submit');
        const requestBody = {
            ...suite_data,
            building: Property,
        };
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/suites`, requestBody);
            const new_suite = response.data;
            setSuiteID(new_suite._id);
            fetchSuites();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (Property) {
            fetchSuites();
        } else {
            setSuites(null);
            setSuiteID("");
        }
    }, [Property]);

    useEffect(() => {
        props.onSuiteChange(SuiteID);
    }, [SuiteID]);

    return (
        <Fragment>
            <PropertyForm onPlaceChange={setProperty}/>
            {Property && Suites && 
                <Form.Group className='mb-3'>
                    <Form.Label>Suite No.</Form.Label>
                    <Form.Select aria-label='Suite Selection' value={SuiteID} onChange={e => {setSuiteID(e.target.value)}}>
                        <option value="">Choose a Suite</option>
                        {Suites.map(suite => 
                            <option key={suite._id} value={suite._id}>{suite.suite_no}</option>
                        )}
                    </Form.Select>
                </Form.Group>
            }
            {Property && Suites && !SuiteID && 
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormField name='suite_no' type='number' styles='mb-3' icon='bi bi-door-closed' label='Suite No.' placeholder='Suite No.' control={control} errors={errors}/>
                    <FormField name='floor' type='number' styles='mb-3' icon='bi bi-stack' label='Floor No.' placeholder='Floor No.' control={control} errors={errors}/>

                    <h2>Suite Amenities</h2>
                    {SuiteVars.AMENITIES.map(amenity =>
                        <Controller
                            key={amenity.name}
                            control={control}
                            name={amenity.name}
                            render={({ field }) => 
                                <Form.Check type='checkbox' id={amenity.name} label={amenity.label} {...field}/>
                            }
                        />
                    )}

                    {/*<Button variant="primary" type="submit">Submit Suite</Button>*/}
                    <input type="submit" value="Submit"/>
                </Form>
            }
        </Fragment>
    )
}

export default SuiteForm;