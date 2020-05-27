# Usput - delivery service

## Project description

“Usput” is a web application delivery service.

The application will provide everybody a possibility to register and post an offer for transferring a
package from one location to another. The advertiser will post package description which will include
weight, size, price they are willing to pay, location from which the package is transferred as well as the
arriving address.

Registered users will be able also to accept those offers and fulfill shipments for a fee. This peer to
peer delivery service would be good for end users because they avoid flat rates of courier agencies as
well as their additional fees. One will post a price they are willing to pay and somebody that is fine
with that price will accept the offer. Simple as that.

Entities: Users, Transactions, Offers, Orders, Logs.

## Main features

- Ability to create user profile
- Users can create, view, accept and complete offers
- Ability to view your profile and offers on profile
- Alternative sign-in options
- Ability to edit your profile and view other users’ profiles

## Technologies

Project will be based on MERN stack, meaning frontend will be implemented using ReactJS, backend
will be on NodeJS using ExpressJS and database will be MongoDB.

## Architecture and Design patterns

Main goal of this project was to showcase different architectural and design patterns. For us, the most
logical architectural pattern to choose was 3 Layer Architecture:

1. Presentation Layer - [Frontend part of the project](./client)
2. Business Logic Layer - [Backend part of the project](./server)
3. Data (Access) Layer - Database part of the project (this is not represented in code because we have
   setup out database on MongoDB Atlas and implemented using mongojs library)

Regarding design patterns, for us was important to showcase one on each side of code, server and client side.
Having that in mind, on client side we have choosen to implement Adapter Design pattern with our API calls.
This pattern can be seen in [api](./client/src/api) folder. This was to prevent exposing our calls, url's and
logic. The calls are executed using axios library and by making our [custom axios](./client/src/api/customAxios.js)
we have eliminated repetition of code. In the actual component side axios calls are executed by just calling
wanted function and passing eventual parameters. Example of this can be seen [here](./client/src/pages/Profile/Profile.js)
on line 30.

On server side of the project, we implemented Singleton Design pattern, which prevented exposing our Business
Layer Logic. We have done this by creating separate [classes](./server/stores) with implemented constructors
(kind of a dependency injection) and methods with our calls to database. This simplified code readability and
secured our business logic, can be seen [here](./server/routes/member.js).
