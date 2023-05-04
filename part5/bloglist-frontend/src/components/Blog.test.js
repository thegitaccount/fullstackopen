import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'



describe('Testing that Blog component is working as intended:', () => {
  test('rendering title and author of blogs', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Pauli Kulho'
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText(`${blog.title} ${blog.author}`)
    expect(element).toBeDefined()
  })

  test('clicking the "View" -button reveals more info', async () => {
    const blog = {
      url: 'https://example.com',
      likes: 5,
      user: {
        user: 'admin',
        name: 'huru-ukko'
      }
    }
    const mockHandler = jest.fn()

    render(<Blog blog={blog} toggleDetails={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(blog.likes)).toBeDefined()
    expect(screen.getByText(blog.user.name)).toBeDefined()

  })

  test('clicking the "Like" -button twice calls event handler twice', async () => {

    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Pauli Kulho',
      url: 'https://example.com',
      likes: 5,
      user: {
        user: 'admin',
        name: 'huru-ukko'
      }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} addLike={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })
})