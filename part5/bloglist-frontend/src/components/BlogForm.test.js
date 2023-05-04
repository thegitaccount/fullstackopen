import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('a new blog calls the callback function received as a prop with the correct information', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm addBlog={addBlog} />)

  const titleInput = container.querySelector('input[name=title]')
  const authorInput = container.querySelector('input[name=author]')
  const urlInput = container.querySelector('input[name="url"]')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Elämäni Naiset')
  await user.type(authorInput, 'Rantojen Renttu')
  await user.type(urlInput, 'https://www.example.com')
  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls).toEqual(expect.arrayContaining([
    ['Elämäni Naiset', 'Rantojen Renttu', 'https://www.example.com']
  ]))
})