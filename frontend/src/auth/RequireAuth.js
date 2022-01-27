import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './AuthVars';

function RequireAuth(props) {
    const authInfo = useContext(AuthContext);
    const history = useHistory();
    
    if(authInfo.UserID) {
        return props.children;
    } else {
        history.push('/login');
        return null;
    }
}

export default RequireAuth;