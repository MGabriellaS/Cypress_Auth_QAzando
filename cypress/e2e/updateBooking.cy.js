/// <reference types="cypress"/>

describe('Update booking', () => {

    const payload_criacao = require('../fixtures/criarReserva.json')
    const password_criarReserva = require('../fixtures/atualizarReserva.json')
    let bookingid = ''
    var token = ''

    before('login', () => {
       cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                "username": "admin",     
                "password": "password123" 
            }

        }).then((response) => {
            token = response.body.token
            expect(response.status).to.equal(200)
        })
    });

    beforeEach('create booking', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: payload_criacao
        }).then((response) =>{
            bookingid = response.body.bookingid
            console.log(response.body)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('bookingid')
            expect(response.body.bookingid).to.be.a('number')  
            expect(response.body.bookingid).not.to.null
            expect(response.body.booking.totalprice).to.equal(666)
            
        });
    });

    it('should update booking', () => {
            cy.request({
                method: 'PUT',
                url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
                //failonstatuscode: false,
                body: password_criarReserva,
                headers: {
                    'contente-type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': `token= ${token}`
                }
            }).then((response) =>{
                console.log(response.body)
                expect(response.status).to.equal(200)
                expect(response.body.totalprice).to.equal(6669)
            })
    });

    it('update booking whitout token', () => {
            cy.request({
                method: 'PUT',
                url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
                failOnStatusCode: false,
                body: password_criarReserva,
                headers: {
                    'contente-type': 'application/json',
                    'Accept': 'application/json',
                    //'Cookie': 'token=' + token
                }
            }).then((response) =>{
                expect(response.status).to.eq(403)
            })
    });
});