import './ListingForm.css';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as ListingVars from './Listing';
import { yupResolver } from '@hookform/resolvers/yup';
import SuiteForm from './SuiteForm';
import FormField from './FormField';

function ListingForm(props) {
    const [SuiteID, setSuiteID] = useState("");

    const {handleSubmit, control, formState: { errors }} = useForm({
        resolver: yupResolver(ListingVars.SCHEMA),
        defaultValues: ListingVars.DEFAULT_VALUES,
    });

    function onSubmit(listing_data) {
        const requestBody = {
            ...listing_data
        };
        await axios.post(`${process.env.REACT_APP_API_URL}/listings`, requestBody);
    }

    function onSuiteChange(suite) {
        setSuiteID(suite);
    }
    
    return (
        <Fragment>
            <SuiteForm onSuiteChange={onSuiteChange} />
            {SuiteID &&
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormField name='room_no' type='number' styles='mb-3' icon='bi bi-door-closed' label='Room No.' placeholder='Room No.' control={control} errors={errors}/>
                    <FormField name='price' type='date' styles='mb-3' before='$' after='.00' label='Amount (to the nearest dollar' control={control} errors={errors}/>
                    <FormField name='moveInDate' type='date' styles='mb-3' icon='bi bi-calendar-event' label='Move In Date' placeholder='Move In Date' control={control} errors={errors}/>
                    <FormField name='moveOutDate' type='date' styles='mb-3' icon='bi bi-calendar-event-fill' label='Move Out Date' placeholder='Move Out Date' control={control} errors={errors}/>
                    <FormField name='room_size' type='number' styles='mb-3' icon='bi bi-border' label='Room Size' placeholder='Room Size' control={control} errors={errors}/>

                    <h2>Room Amenities</h2>
                    {ListingVars.AMENITIES.forEach(amenity => {
                        <Controller
                            control={control}
                            name={amenity.name}
                            render={({ field }) => {
                                <Form.Check type='checkbox' id={amenity.name} label={amenity.label} checked={value} {...field} />
                            }}
                        />
                    })}
                    <Button variant="primary" type="submit">Post Listing</Button>
                </Form>
            }
        </Fragment>
    )
}

export default ListingForm;