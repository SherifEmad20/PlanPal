cd /home/sherif/proj/PlanPal/k8s_files

kubectl delete deployment --all

kubectl delete svc planpal-backend-service

kubectl delete svc planpal-frontend-service

kubectl delete svc planpal-database-service