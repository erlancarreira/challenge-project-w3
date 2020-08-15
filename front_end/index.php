<?php
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

//use Throwable;

require __DIR__ . '/vendor/autoload.php';

// Instantiate App
$app = AppFactory::create();

$app->addRoutingMiddleware();

//$app->addBodyParsingMiddleware();

// Add error middleware
//$app->addErrorMiddleware(true, false, false);



$app->options('/{routes:.+}', function ($request, $response, $args) {
    //var_dump($request, $response); exit;
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
    
    $payload = [
        'msg'  => $exception->getMessage(),
        'code' => $exception->getCode()
    ];

    $response = $app->getResponseFactory()->createResponse();
    
    $response->getBody()->write((string)
        json_encode($payload, JSON_UNESCAPED_UNICODE)
    );

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($exception->getCode());

    //return $response;
};

// Add Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

$guzzleConfig = [
    'verify' => false, 
    'timeout' => 2.0, 
    'base_uri' => 'https://wattend.com.br/wattendws/index.php/'
];


$app->get('/api', function (Request $request, Response $response) {
    $response->getBody()->write('Api - Ambiente de desenvolvimento.');
    return $response;
});

// Add routes
$app->post('/login', function (Request $request, Response $response) use($guzzleConfig) {
    
    $body = json_decode($request->getBody());
    
    if (empty($body->email) || empty($body->senha)) {
        
        throw new Exception("Preencha todos os campos.", 401);
    }

    $client = new Client($guzzleConfig);
    
    $httpResponse = $client->post('login', ['json' => $body]);

    $contents = json_decode($httpResponse->getBody(), true);
    
    $response 
        ->getBody()
        ->write((string) json_encode(array_merge($contents, ['token' => '@w3inovA-toKen'])));

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($httpResponse->getStatusCode());
        
});

$app->get('/leads', function (Request $request, Response $response, $args) use($guzzleConfig) {
    
    $client = new Client($guzzleConfig);
    
    //$httpResponse = $client->get('https://wattend.com.br/wattendws/index.php/leads');

    //$contents = json_decode($httpResponse->getBody());

    $leads = [[
        "id"                 => "485",
        "id_origem"          =>  "1002530303",
        "dataentrada"        =>  "2020-08-11",
        "estagio"            =>  "A",
        "dataproxatividade"  =>  null,
        "dataultatividade"   =>  null,
        "dataapropriacao"    =>  null,
        "idusuario"          =>  null,
        "email"              =>  "murilo@w3inova.com.br", 
        "qtadultos"          =>  null,
        "qtdcriancas"        =>  null,
        "nome"               =>  "Murilo de Oliveira Melo",
        "empresa"            =>  null,
        "telefone"           =>  null,
        "celular"            =>  null,
        "tipohotel"          =>  null,
        "destino"            =>  null,
        "cidade"             =>  null,
        "hotelpreferencia"   =>  null,
        "dataviagemprevista" =>  null,
        "qtdnoites"          =>  null
    ]]; 
    
    $response->getBody()->write((string) json_encode($leads));
    
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
});

$app->run();
