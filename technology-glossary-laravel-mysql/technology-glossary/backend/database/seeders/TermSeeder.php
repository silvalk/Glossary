<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Term;
use Illuminate\Database\Seeder;

class TermSeeder extends Seeder
{
    /**
     * Importa os 40 termos que estavam em INITIAL_TERMS (data.js),
     * preservando o texto original em inglês/português, e inclui a
     * tradução em português de cada palavra (campo novo "translation").
     *
     * Rode com: php artisan db:seed
     */
    public function run(): void
    {
        $termos = [
            ['term' => 'Algorithm', 'translation' => 'Algoritmo', 'category' => 'programming', 'explanation' => 'Uma sequência de instruções organizada para resolver um problema ou realizar determinada tarefa.'],
            ['term' => 'API', 'translation' => 'API (Interface de Programação)', 'category' => 'web', 'explanation' => 'Um conjunto de regras que permite que diferentes sistemas ou aplicativos se comuniquem entre si.'],
            ['term' => 'Artificial Intelligence', 'translation' => 'Inteligência Artificial', 'category' => 'ai', 'explanation' => 'Área da tecnologia que cria sistemas capazes de simular capacidades humanas, como aprender e tomar decisões.'],
            ['term' => 'Backend', 'translation' => 'Back-end', 'category' => 'systems', 'explanation' => 'Parte de um sistema responsável pelos processos que acontecem no servidor e que normalmente não são vistos diretamente pelo usuário.'],
            ['term' => 'Browser', 'translation' => 'Navegador', 'category' => 'web', 'explanation' => 'Programa utilizado para acessar e navegar por páginas da internet.'],
            ['term' => 'Bug', 'translation' => 'Erro de Programação', 'category' => 'systems', 'explanation' => 'Um erro ou falha em um programa que faz com que ele funcione de forma inesperada.'],
            ['term' => 'Cache', 'translation' => 'Memória Temporária', 'category' => 'systems', 'explanation' => 'Um espaço de armazenamento temporário utilizado para acelerar o acesso a dados usados com frequência.'],
            ['term' => 'Cloud Computing', 'translation' => 'Computação em Nuvem', 'category' => 'web', 'explanation' => 'Uso de servidores na internet para armazenar dados e executar programas, em vez de utilizar apenas um computador local.'],
            ['term' => 'Code', 'translation' => 'Código', 'category' => 'programming', 'explanation' => 'Conjunto de instruções escritas em uma linguagem de programação para que um computador execute uma tarefa.'],
            ['term' => 'Compiler', 'translation' => 'Compilador', 'category' => 'programming', 'explanation' => 'Programa que transforma o código escrito por um desenvolvedor em instruções que o computador consegue executar.'],
            ['term' => 'Computer', 'translation' => 'Computador', 'category' => 'hardware', 'explanation' => 'Máquina eletrônica capaz de processar dados e executar tarefas conforme instruções recebidas.'],
            ['term' => 'Database', 'translation' => 'Banco de Dados', 'category' => 'ai', 'explanation' => 'Um sistema utilizado para armazenar, organizar e consultar informações.'],
            ['term' => 'Debugging', 'translation' => 'Depuração', 'category' => 'programming', 'explanation' => 'Processo de encontrar e corrigir erros em um programa de computador.'],
            ['term' => 'Developer', 'translation' => 'Desenvolvedor', 'category' => 'systems', 'explanation' => 'Profissional responsável por criar, testar e manter programas e sistemas.'],
            ['term' => 'Domain', 'translation' => 'Domínio', 'category' => 'web', 'explanation' => 'Nome utilizado para identificar e acessar um site na internet, como exemplo.com.'],
            ['term' => 'Download', 'translation' => 'Transferência de Arquivo', 'category' => 'web', 'explanation' => 'Ato de transferir um arquivo da internet para o computador ou dispositivo do usuário.'],
            ['term' => 'Encryption', 'translation' => 'Criptografia', 'category' => 'security', 'explanation' => 'Técnica que transforma informações em um código, protegendo dados contra acessos não autorizados.'],
            ['term' => 'Firewall', 'translation' => 'Firewall (Barreira de Proteção)', 'category' => 'security', 'explanation' => 'Um mecanismo de segurança utilizado para controlar e filtrar conexões de rede.'],
            ['term' => 'Framework', 'translation' => 'Arcabouço de Desenvolvimento', 'category' => 'programming', 'explanation' => 'Um conjunto de ferramentas e padrões que facilita e organiza o desenvolvimento de programas.'],
            ['term' => 'Frontend', 'translation' => 'Front-end', 'category' => 'systems', 'explanation' => 'Parte de um site ou sistema com a qual o usuário interage diretamente, como botões, menus, textos e imagens.'],
            ['term' => 'Git', 'translation' => 'Git (Controle de Versão)', 'category' => 'programming', 'explanation' => 'Ferramenta utilizada para controlar e organizar diferentes versões do código de um projeto.'],
            ['term' => 'Hardware', 'translation' => 'Hardware', 'category' => 'hardware', 'explanation' => 'Conjunto das partes físicas de um computador, como processador, memória e teclado.'],
            ['term' => 'Hosting', 'translation' => 'Hospedagem', 'category' => 'web', 'explanation' => 'Serviço que armazena os arquivos de um site para que ele fique disponível na internet.'],
            ['term' => 'HTML', 'translation' => 'HTML (Linguagem de Marcação)', 'category' => 'programming', 'explanation' => 'Linguagem utilizada para criar a estrutura e o conteúdo das páginas da Web.'],
            ['term' => 'Internet', 'translation' => 'Internet', 'category' => 'web', 'explanation' => 'Rede mundial que conecta computadores e dispositivos, permitindo a troca de informações entre eles.'],
            ['term' => 'JavaScript', 'translation' => 'JavaScript', 'category' => 'programming', 'explanation' => 'Linguagem de programação utilizada para adicionar interatividade às páginas da Web.'],
            ['term' => 'Machine Learning', 'translation' => 'Aprendizado de Máquina', 'category' => 'ai', 'explanation' => 'Área da inteligência artificial em que os sistemas aprendem a partir de dados para melhorar suas previsões e decisões.'],
            ['term' => 'Malware', 'translation' => 'Programa Malicioso', 'category' => 'security', 'explanation' => 'Programa criado com a intenção de causar danos, roubar dados ou invadir sistemas.'],
            ['term' => 'Network', 'translation' => 'Rede', 'category' => 'web', 'explanation' => 'Conjunto de computadores e dispositivos conectados entre si para compartilhar dados e recursos.'],
            ['term' => 'Operating System', 'translation' => 'Sistema Operacional', 'category' => 'hardware', 'explanation' => 'Programa principal que gerencia o funcionamento do computador e permite executar outros programas.'],
            ['term' => 'Password', 'translation' => 'Senha', 'category' => 'security', 'explanation' => 'Uma sequência de caracteres utilizada para proteger o acesso a contas e sistemas.'],
            ['term' => 'Phishing', 'translation' => 'Phishing (Golpe Online)', 'category' => 'security', 'explanation' => 'Golpe utilizado para enganar usuários e roubar informações pessoais, geralmente por e-mail ou mensagens falsas.'],
            ['term' => 'Programming', 'translation' => 'Programação', 'category' => 'programming', 'explanation' => 'Processo de criar programas de computador escrevendo instruções em uma linguagem específica.'],
            ['term' => 'RAM', 'translation' => 'Memória RAM', 'category' => 'hardware', 'explanation' => 'Memória do computador utilizada para armazenar dados temporariamente enquanto os programas estão em uso.'],
            ['term' => 'Server', 'translation' => 'Servidor', 'category' => 'systems', 'explanation' => 'Um computador ou sistema responsável por fornecer serviços, dados ou recursos para outros computadores e dispositivos.'],
            ['term' => 'Software', 'translation' => 'Software', 'category' => 'systems', 'explanation' => 'Conjunto de programas e instruções que permitem ao computador realizar tarefas.'],
            ['term' => 'Source Code', 'translation' => 'Código-fonte', 'category' => 'programming', 'explanation' => 'Conjunto de instruções escritas por um desenvolvedor em uma linguagem de programação, antes de serem executadas pelo computador.'],
            ['term' => 'URL', 'translation' => 'URL (Endereço Web)', 'category' => 'web', 'explanation' => 'Endereço utilizado para localizar e acessar uma página específica na internet.'],
            ['term' => 'Virus', 'translation' => 'Vírus', 'category' => 'security', 'explanation' => 'Programa malicioso capaz de se espalhar e causar danos a arquivos e sistemas.'],
            ['term' => 'Wi-Fi', 'translation' => 'Wi-Fi (Rede sem Fio)', 'category' => 'web', 'explanation' => 'Tecnologia que permite a conexão sem fio de dispositivos a uma rede de internet.'],
        ];

        foreach ($termos as $dados) {
            $categoria = Category::where('slug', $dados['category'])->first();

            if (!$categoria) {
                continue;
            }

            Term::updateOrCreate(
                ['term' => $dados['term']],
                [
                    'translation' => $dados['translation'],
                    'explanation' => $dados['explanation'],
                    'category_id' => $categoria->id,
                ]
            );
        }
    }
}
