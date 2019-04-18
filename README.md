# CS467_Employee_Recognition_Portal
CS467 - Capstone Project: Employee Recognition Portal

Project Team:
- Ashley Fong (Log-in and Authentication)
- Ming Lui (User Dashboard)
- Ben Redmon (Admin Dashboard)  

CS467: Capstone Project  
March 18, 2019  

Our team created a database backed website used to organize, create, and track employee recognition awards. Each of us had some experience from our previous coursework building a web application using Express and Node.js with a SQL database.  This project gave us the opportunity to get to more experience working with those backend technologies while also learning a new front-end framework, Angular.

Program Description: There are two different user experiences for this website. One is for employees with a standard user account to create new awards, and another for employees with administrative accounts for managing both user and admin accounts as well as creating graphical reports for issued awards. Both types of users start at a landing page requiring them to login to access the website. Each has the option of receiving an email to recover a forgotten password. From there, the two types of users have
different access within their respective portals.

Standard User Account: Once logged in, the primary function for a standard user is to create an award to recognize one of their fellow employees as “Employee of the Week” or “Employee of the Month”. Upon submission of this award, a certificate is created which includes the recipients name, the date, and the senders name and signature. The certificate is then emailed to the recipient as a pdf document. In addition to creating awards, a standard user can also view and delete previous awards given as well as change their name in the system.

Administrative Account: Once logged in, an administrative has access to all standard and admin user account records. With this access, an admin can add, delete, or edit any of the accounts authorized to use the system. With this being an internal company employee recognition system, new accounts can only be created by a user with admin privileges. In addition to managing user accounts, an admin can also run queries on awards data to produce reports including graphical charts.
