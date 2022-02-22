import {Controller} from 'react-hook-form';
import {InputGroup, Form} from 'react-bootstrap';
import {ErrorMessage} from '@hookform/error-message';

function FormField(props) { //control, name, type, placeholder, label, errors, styles, icon
    return (
        <InputGroup className={props.styles} hasValidation>
            <InputGroup.Text>{props.icon && <i className={props.icon}></i>} {props.before} </InputGroup.Text>
            <Controller
                control={props.control}
                name={props.name}
                render={({ field }) =>
                    <Form.Control type={props.type} placeholder={props.placeholder} aria-label={props.label} {...field} />
                }
            />
            {props.after && <InputGroup.Text>{props.after}</InputGroup.Text>}
            <ErrorMessage
                errors={props.errors}
                name={props.name}
                render={({message}) => <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>}
            />
        </InputGroup>
    );
}

export default FormField;