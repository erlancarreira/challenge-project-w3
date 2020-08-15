<?php
require __DIR__ . '/vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

//use Slim\Exception\HttpNotFoundException;


use Psr\Http\Server\RequestHandlerInterface;

use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Psr\Http\Message\RequestInterface;



// Instantiate App
$app = AppFactory::create();

$app->addRoutingMiddleware();

//$app->addBodyParsingMiddleware();

// Add error middleware
//$app->addErrorMiddleware(true, false, false);



$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    $response = $response->withHeader('Content-type', 'application/json');

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        
});


// Define Custom Error Handler
$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails

) use ($app) {
    
    $message = '';

    switch ($exception->getMessage()) {
        case 'login_empty':
            $message = 'Preencha os campos!';
            break;

        case 'email_invalid':
            $message = 'Email inválido!';
            break;    
        
        default:
            $message = 'Dados inválidos!';
            break;
    }
    
    $payload = [
        'msg' => $message,
        'code'  => $exception->getCode()
    ];

    $response = $app->getResponseFactory()->createResponse();
    
    $response->getBody()->write((string)
        json_encode($payload, JSON_UNESCAPED_UNICODE)
    );

    return $response
        // ->withHeader('Content-Type', 'application/json')
        ->withStatus($exception->getCode());
};

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$guzzleConfig = [
    'verify' => false, 
    'timeout' => 2.0, 
    'base_uri' => 'https://169.57.146.174/wattendws/index.php/'
];

// Add routes
$app->post('/login', function (Request $request, Response $response) use ($guzzleConfig) {
    
    $body = json_decode($request->getBody());
    
    if (empty($body->email) || empty($body->senha)) {
        
        throw new Exception("login_empty", 401);
    }

    if (!filter_var($body->email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("email_invalid", 401);
    }

    $client = new Client($guzzleConfig);
    
    $httpResponse = $client->post('login', ['json' => $body]);

    $contents = json_decode($httpResponse->getBody(), true);

    $contents = array_map('strtolower', $contents); // LowerCase
    
    $response 
        ->getBody()
        ->write((string) json_encode($contents));

    return $response
        //->withHeader('Content-Type', 'application/json')
        ->withStatus($httpResponse->getStatusCode());
        
});

$app->get('/leads', function (Request $request, Response $response, $args) use($guzzleConfig) {
    
    $body = json_decode($request->getBody());

    // $leads = [[
    //     "id"                 => "485",
    //     "id_origem"          =>  "1002530303",
    //     "dataentrada"        =>  "2020-08-11",
    //     "estagio"            =>  "A",
    //     "dataproxatividade"  =>  null,
    //     "dataultatividade"   =>  null,
    //     "dataapropriacao"    =>  null,
    //     "idusuario"          =>  null,
    //     "email"              =>  "murilo@w3inova.com.br", 
    //     "qtadultos"          =>  null,
    //     "qtdcriancas"        =>  null,
    //     "nome"               =>  "Murilo de Oliveira Melo",
    //     "empresa"            =>  null,
    //     "telefone"           =>  null,
    //     "celular"            =>  null,
    //     "tipohotel"          =>  null,
    //     "destino"            =>  null,
    //     "cidade"             =>  null,
    //     "hotelpreferencia"   =>  null,
    //     "dataviagemprevista" =>  null,
    //     "qtdnoites"          =>  null
    // ]]; 
    
    $client = new Client($guzzleConfig);
    
    $httpResponse = $client->get('leads', ['auth' => ['root', 'teste123'],'json' => $body]);

    $contents = json_decode($httpResponse->getBody(), true);
    
    $response 
        ->getBody()
        ->write((string) json_encode($contents));

    return $response
        //->withHeader('Content-Type', 'application/json')
        ->withStatus($httpResponse->getStatusCode());
});

$app->run();
