import axios from "axios";

const LandingPage = ({currentUser}) => {
    console.log('I am in component', currentUser);
    return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async () => {
    const response = await axios.get('/api/users/currentuser');

    if(typeof  window === 'undefined'){
        // we are on the server!
        // requests should be made to http://ingress-nginx
    } else {
        // we are on the browser!
        // requests can be made with a base url of ''
    }

    return {};
};

export default LandingPage;