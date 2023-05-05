describe('Blog app ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tohtori Sykerö',
      username: 'tohtorismies',
      password: 'tohtorismies'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  describe('User can login',function() {

    it('Login form is shown', function() {
      cy.contains('Log in to application')
      cy.contains('login').click()
    })

    it('login fails with wrong password', function() {
      cy.contains('login').click()
      cy.get('#username').type('tohtorismies')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
    })

    it('login succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('tohtorismies')
      cy.get('#password').type('tohtorismies')
      cy.get('#login-button').click()
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('tohtorismies')
      cy.get('#password').type('tohtorismies')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('input[name="title"]').type('Sykerön Elämänkerta')
      cy.get('input[name="author"]').type('Tohtori Sykerö')
      cy.get('input[name="url"]').type('www.example.com')
      cy.contains('create').click()
      cy.contains('A new blog Sykerön Elämänkerta by Tohtori Sykerö added')
      cy.contains('Sykerön Elämänkerta Tohtori Sykerö')
    })

    it('A blog can be liked', function() {
      cy.contains('Create new blog').click()
      cy.get('input[name="title"]').type('Sykerön Elämänkerta')
      cy.get('input[name="author"]').type('Tohtori Sykerö')
      cy.get('input[name="url"]').type('www.example.com')
      cy.contains('create').click()
      cy.contains('View').click()
      cy.get('#like-button').click()
      cy.contains('#like-button', 'Like')
        .parent()
        .should('contain', '1')
    })

    it('A blog can be removed', function() {
      cy.contains('Create new blog').click()
      cy.get('input[name="title"]').type('Sykerön Elämänkerta')
      cy.get('input[name="author"]').type('Tohtori Sykerö')
      cy.get('input[name="url"]').type('www.example.com')
      cy.contains('create').click()
      cy.contains('View').click()
      cy.contains('Remove').click()
      cy.on('window:confirm', () => true)
      cy.contains('Sykerön Elämänkerta Tohtori Sykerö').should('not.exist')
    })

    it('Only blog creater is able to see the remove button', function() {
      cy.contains('Create new blog').click()
      cy.get('input[name="title"]').type('Sykerön Elämänkerta')
      cy.get('input[name="author"]').type('Tohtori Sykerö')
      cy.get('input[name="url"]').type('www.example.com')
      cy.contains('create').click()
      cy.contains('Sykerön Elämänkerta Tohtori Sykerö')
      cy.contains('View').click()
      cy.contains('Remove')
      cy.contains('Logout').click()

      const user = {
        name: 'Dr. Sykerös evil twin',
        username: 'jepulis',
        password: 'jepulis'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.visit('http://localhost:3000')
      cy.get('#username').type('jepulis')
      cy.get('#password').type('jepulis')
      cy.get('#login-button').click()
      cy.contains('Sykerön Elämänkerta Tohtori Sykerö')
      cy.contains('View').click()
      cy.should('not.contain', 'Remove')

    })
    it('blogs are reordered based on likes', function() {

      const blogs = [
        {
          title: 'Blog 1',
          author: 'Author 1',
          url: 'http://example.com/blog1',
          likes: 3
        },
        {
          title: 'Blog 2',
          author: 'Author 2',
          url: 'http://example.com/blog2',
          likes: 2
        },
        {
          title: 'Blog 3',
          author: 'Author 3',
          url: 'http://example.com/blog3',
          likes: 1
        },
        {
          title: 'Blog 4',
          author: 'Author 4',
          url: 'http://example.com/blog4',
        }
      ]

      blogs.forEach(blog => {
        cy.contains('Create new blog').click()
        cy.get('input[name="title"]').type(blog.title)
        cy.get('input[name="author"]').type(blog.author)
        cy.get('input[name="url"]').type(blog.url)
        cy.contains('create').click()
        cy.contains('View').click()
      })

      cy.get('.blog').eq(0).should('contain', 'Blog 1')
      cy.get('.blog').eq(1).should('contain', 'Blog 2')

      // tykkäillään
      cy.get('.blog').eq(0).find('#like-button').click()
      cy.get('.blog').eq(2).find('#like-button').click().click().click().click().click()

      cy.get('.blog').eq(3)
        .find('#like-button')
        .then($likeButton => {
          for (let i = 0; i < 10; i++) {
            cy.wrap($likeButton).click()
          }
        })

      cy.get('.blog').eq(0).should('contain', 'Blog 4')
      cy.get('.blog').eq(1).should('contain', 'Blog 3')
      cy.get('.blog').eq(2).should('contain', 'Blog 1')
      cy.get('.blog').eq(3).should('contain', 'Blog 2')

    })

  })
})