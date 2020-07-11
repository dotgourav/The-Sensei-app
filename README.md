Sensie App
============
An app where great teachers are found.


##### Tech stack: `Python 3 and Django 3`

### Setup

- Create virtualenv using `Python3`
- Install requirements by `pip install -r requirements.txt`
- Install some style dependencies using `bower install`
> Note: You'll need to have bower installed on your machine. Refer this: https://bower.io/#install-bower
- Create database with `python manage.py migrate`
- Gather staticfiles with `python manage.py collecstatic --no-input`
- Create superuser by `python manage.py createsuperuser`
- Runserver by `python manage.py runserver`
- Go to homepage and login with above created user
- Import teachers and put the images in the `media/user/` folder
