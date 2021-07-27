kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${KEY_FILE} -out ${CERT_FILE} -subj "/CN=${HOST}/O=${HOST}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl-key.key -out ssl-cert.cert -subj "/CN=ticketing.dev/O=ticketing.dev"

kubectl create secret tls ${CERT_NAME} --key ${KEY_FILE} --cert ${CERT_FILE}
kubectl create secret tls ticketing --key ssl-key.key --cert ssl-cert.cert

kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_51JHfUpBA28lmwzEchTJIt7zeUyh1GEVzY9iXTPdsEkzwmCAAId36yPWL4rz7dB9WzF6250rfDUgFKPMGGrq42rWn00aEgwelbN