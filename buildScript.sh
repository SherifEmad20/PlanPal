cd /home/sherif/proj/PlanPal/k8s_files

kubectl delete svc planpal-database-service

kubectl create -f planpal-database-deployment.yaml

kubectl create -f planpal-backend-deployment.yaml

kubectl create -f planpal-frontend-deployment.yaml
