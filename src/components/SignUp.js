import React, {useState} from 'react';

function SignUp() {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('male');

    const nameHandler = (value) => {
        setName(value);
    }
    const passwordHandler = (value) => {
        setPassword(value);
    }
    const emailHandler = (value) => {
        setEmail(value);
    }
    const genderHandler = (value) => {
        setGender(value);
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submitted');
            console.log({
                name,
                password,
                email,
                gender
            });
        }}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" value={name} onChange={(e) => nameHandler(e.target.value)} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => passwordHandler(e.target.value)} />
            <br />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => emailHandler(e.target.value)} />
            <br />
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={gender} onChange={(e) => genderHandler(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
}

export default SignUp;