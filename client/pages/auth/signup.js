import {useState} from 'react';
import axios from 'axios';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const onSubmit = async event => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup', {
                email, password
            });
    
        } catch (error) {
            setErrors(error.response.data.errors);
        }
    }

    return <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Email address</label>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)} 
                className="form-control"
            />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password" 
                className="form-control"
            />
        </div>
        {errors.length > 0 && <div className="alert alert-danger">
            <h4>Oooops.....</h4>
            <ul className="my-0">
                {errors.map(err => (
                    <li key={err.message}>{err.message}</li>
                ))}
            </ul>
        </div>}
        <button className="btn btn-primary">Sign Up</button>
    </form>

}

export default SignUp;