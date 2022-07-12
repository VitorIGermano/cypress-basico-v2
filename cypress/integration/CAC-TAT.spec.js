/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    //VARIAVEL CRIADA PARA NÃO TER A NECESSIDADE DE ESCREVER O 3 SEGS EM TODO O CODICO UTILIZANDO SOMENTE A VARIAVEL
    const THREE_SECONDS_IN_MS = 3000

    beforeEach(function() {
        cy.visit('./src/index.html')
    })
    
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(5, function(){
        it.only('Preenche os campos obrigatórios e envia o formulário', function(){

            const longText = 'Ótimo, adore otimo, muito bom maluco, sensacional, eu adorei a forma de como é trabalhar, sensácional!!'
            //cy.clock está parando o relogio do navegador
            cy.clock()
            cy.get('#firstName').type('Vitor')
            cy.get('#lastName').type('Pereira')
            cy.get('#email').type('vitor@outlook.com')
            cy.get('#open-text-area').type(longText, {delay: 0})
            cy.contains('button','Enviar').click()
            //cy.get('button[type="submit"]').click()
            cy.get('.success').should('be.visible')
            //Cy.tick está avançando 3 segundos o relogio do navegador, isso é utilizado para verificar se as mensagens de sucesso ou erro estão aparecendo ou sumindo
            cy.tick(THREE_SECONDS_IN_MS)
            cy.get('.success').should('not.be.visible')
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()
        
        cy.get('#firstName').type('Vitor')
        cy.get('#lastName').type('Pereira')
        cy.get('#email').type('vitor,outlook.com')
        cy.get('#open-text-area').type('teste', {delay: 0})
        cy.contains('button','Enviar').click()
        //cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

    })

    it('Se um valor não-numérico for digitado, seu valor continuará vazio.', function(){
        cy.get('#phone').type('fasaffsa').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()

        cy.get('#firstName').type('Vitor')
        cy.get('#lastName').type('Pereira')
        cy.get('#email').type('vitor@outlook.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste', {delay: 0})
        cy.contains('button','Enviar').click()
        //cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
        
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Vitor').should('have.value', 'Vitor').clear().should('have.value', '')
        cy.get('#lastName').type('Pereira').should('have.value', 'Pereira').clear().should('have.value', '')
        cy.get('#email').type('vitor@outlook.com').should('have.value', 'vitor@outlook.com').clear().should('have.value', '')
        cy.get('#phone').type('15165105').should('have.value', '15165105').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.clock()
        
        cy.contains('button','Enviar').click()
        //cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){

        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
          })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]').check().should('be.checked').last().uncheck().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json')
          .should(function(input) {
            expect(input[0].files[0].name).to.equals('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]').selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
          .should(function(input) {
            expect(input[0].files[0].name).to.equals('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json', { endcoding: null}).as('examplefile')
        cy.get('input[type="file"]')
          .selectFile({
            contents: '@examplefile', 
            fileName: 'example.json'
          })
          .should(function(input) {
            expect(input[0].files[0].name).to.equals('example.json')
          })
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function(){
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
    })

  })
