import React, {useState} from 'react';

function Form() {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const passwordHandler = (value) => {
        setPassword(value);
    }
    const emailHandler = (value) => {
        setEmail(value);
    }
    
    return (
        <>  
        <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted');
            console.log({
                password,
                email,
            });
        }}>
            <br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => emailHandler(e.target.value)} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => passwordHandler(e.target.value)} />       
            <br />
            <button type="submit">Login</button>
        </form>
        </>
    );
}

export default Form;