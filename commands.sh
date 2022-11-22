# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml

# Create k8s secret for JWT Key
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=${YOUR_JWT_KEY}
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

# Generate TLS/SSL certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${KEY_FILE} -out ${CERT_FILE} -subj "/CN=${HOST}/O=${HOST}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl-key.key -out ssl-cert.cert -subj "/CN=ticketing.dev/O=ticketing.dev"

# Create TLS secret
kubectl create secret tls ${CERT_NAME} --key ${KEY_FILE} --cert ${CERT_FILE}
kubectl create secret tls ticketing --key ssl-key.key --cert ssl-cert.cert

# Create k8s secret for Stripe key
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=${YOUR_STRIPE_KEY}
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_51KIm1OK268r9eAkBL7vvPOli9RMAl9haxuigXIT63D4sGoVA7E180rmvx7ZsTN3vYMggvpW0Z3Lyxn7MRbuR6kdL00GRGovzJL
