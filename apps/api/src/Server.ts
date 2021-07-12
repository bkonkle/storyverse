import App from './App'

export const start = async (): Promise<void> => {
  const app = App.create()

  return app.run()
}

start().catch(console.error)
