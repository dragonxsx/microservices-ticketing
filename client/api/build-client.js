import axios from 'axios';

export default ({req}) => {
    if(typeof window === 'undefined') {
        // We are on the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
            headers: req.headers
        })
    } else {
        // We are on the browser
        return axios.create({
            baseURL: '/'
        })
    }
}