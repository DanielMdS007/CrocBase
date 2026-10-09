import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import './App.css'

function App() {
  return (
    <>
      <Input 
        label="E-mail" 
        type="email" 
        placeholder="Ex: 11111111111@cefet-rj.br" 
      />
      <Input 
        label="Senha" 
        type="password" 
        placeholder="Digite sua senha" 
      />
      <Button>Teste de componente de botão</Button>
    </>
  )
}

export default App