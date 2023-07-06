## Note

Test curl

curl -X POST "https://xzichesmgpyj-cgth.sandbox.formance.cloud/api/ledger/quickstart/transactions" -d '{"timestamp":"2023-07-06T13:46:00.356Z","postings":[{"amount":1000,"asset":"EUR/2","destination":"prestashop:merchant:ZcJJ7lTP63WA6ttf:order:FR1435173","source":"merchant:ZcJJ7lTP63WA6ttf:order:FR1435173"}],"metadata":{"productId":"rbm_example","shopUuid":"fbe25d33-6323-4d93-bcee-8eb92f26d4fe","amount":"1000EUR/2"}}'


client / secret : f382034a-2994-4832-a583-e4baac6e0962 / ff13eed4-1e2f-46ec-95db-ba0b832d9ed7



curl --location 'https://xzichesmgpyj-cgth.sandbox.formance.cloud/api/ledger/quickstart/transactions' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImlkIn0.eyJpc3MiOiJodHRwczovL3h6aWNoZXNtZ3B5ai1jZ3RoLnNhbmRib3guZm9ybWFuY2UuY2xvdWQvYXBpL2F1dGgiLCJhdWQiOlsiZjM4MjAzNGEtMjk5NC00ODMyLWE1ODMtZTRiYWFjNmUwOTYyIl0sImV4cCI6MTY4ODY1NTU0NywiaWF0IjoxNjg4NjUxOTQ3LCJuYmYiOjE2ODg2NTE5NDcsImp0aSI6ImJkNTNiYjZjLTA3YTMtNDcyMi04YjQ5LTMxMDQ1ODg2YWY5YSJ9.H8ZRBXk_hh0mnatGJu8YWoxPwciyOkHjFt8k88QN56otsRTmHMLUKbDTlp4uavmdHCriToPyg4RZg6LudB5oawuIJj-u_SUIRa7WNdfxCuv71VZ3IeQFfeQQpmievcVHNwHaiEPJuCf2GGClDdQ2n-PT4myrna7-3UKWjKJrqZ6_nraP6i68TmbFhv5FcnpjDMgYhlLmSoqjw_sQ3-pe7cilou7gKwDaptn7kcGiiDMPJHhYbQROU7k9s_o7Q6IelM975suIZ8fk0_LnOxwFwHDs1ZQugIj7bu3FmFi9Eic-KBbtf2MCVApyHTwDoFctUCz5MmoIPhJrGtEtRw1Cmw' \
--header 'Content-Type: application/json' \
--data '{
	"timestamp": "2023-07-06T13:46:00.356Z",
	"postings": [{
		"amount": 1000,
		"asset": "EUR/2",
		"destination": "prestashop:merchant:ZcJJ7lTP63WA6ttf:order:FR1435173",
		"source": "merchant:ZcJJ7lTP63WA6ttf:order:FR1435173"
	}],
	"metadata": {
		"productId": "rbm_example",
		"shopUuid": "fbe25d33-6323-4d93-bcee-8eb92f26d4fe",
		"amount": "1000EUR/2"
	}
}'

=> erreur 
{
    "errorCode": "INSUFFICIENT_FUND",
    "errorMessage": "balance.insufficient.EUR/2",
    "error_code": "INSUFFICIENT_FUND",
    "error_message": "balance.insufficient.EUR/2"
}