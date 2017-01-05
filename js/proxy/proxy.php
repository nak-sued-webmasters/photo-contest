<?php
class Proxy {
    
    protected $config = [
        'curl' => [
            CURLOPT_RETURNTRANSFER  => true, // return web page
            CURLOPT_HEADER          => true, // don't return headers
            //CURLINFO_HEADER_OUT     => true, //show request headers
            CURLOPT_FOLLOWLOCATION  => true, // follow redirects
            CURLOPT_ENCODING        => "", // handle all encodings
            CURLOPT_USERAGENT       => "PHP Proxy", // who am i
            CURLOPT_AUTOREFERER     => true, // set referer on redirect
            CURLOPT_CONNECTTIMEOUT  => 120, // timeout on connect
            CURLOPT_TIMEOUT         => 120, // timeout on response
            CURLOPT_MAXREDIRS       => 10, // stop after 10 redirects
            CURLOPT_SSL_VERIFYPEER  => false,
            CURLOPT_NOBODY          => false            
        ],
        'copy_headers' => ['content-type','authorization','origin','accept'],
        'headers' => [],
        'destination_url' => '',
        'response_headers' => []
       
       
    ];
    
    protected $lastHttpResponseCode;
    protected $lastHeaders = [];
    protected $lastTransportErrorMessage;
    protected $lastTransportErrorNumber;
    
    /**
     *
     * @var array
     */
    protected $curlOptions = array(
    );    
    
    public function __construct($config)
    {
        $this->config = array_replace_recursive($this->config, $config);
    }
    
    /**
     * Get request headers
     * 
     * @return array
     */
    protected function getHeaders()
    {
        $headers = [];
        $reqHeaders = getallheaders();        
        foreach ($reqHeaders as $currHeader => $value) {
            foreach ($this->config['copy_headers'] as $copyHeader) {
                if(strtolower($copyHeader) === strtolower($currHeader)){
                    $headers[$currHeader] = $value;
                }
            }
        }        
        $headers = array_merge($headers, $this->config['headers']);        
        $headersStr = [];
        foreach ($headers as $key => $value) {
            $headersStr[] = "$key: $value";
        }
        return $headersStr;
    }
    
    /**
     * Get remote content
     * 
     * @param string $method
     * @param string $url
     * @param string $data
     * @param array $headers
     * @return string|boolean
     */
    protected function grabContent($method, $url, $data = "", array $headers = array())
    {
        $curlCon = curl_init($url);
        curl_setopt($curlCon, CURLOPT_CUSTOMREQUEST, $method);        
        //set headers
        if(count($headers)){
            curl_setopt($curlCon, CURLOPT_HTTPHEADER, $headers);
        }       
        //set options
        foreach ($this->config['curl'] as $option => $value){
            curl_setopt($curlCon, $option, $value);
        }
        //set data
        if(isset ($data) && $data != ''){
            curl_setopt($curlCon, CURLOPT_POSTFIELDS, $data);
        }
        $pageContent = curl_exec($curlCon);
        $errNo = curl_errno($curlCon);
        $errMsg = curl_error($curlCon);        
        
        if($errNo == 0){
            $this->lastHttpResponseCode = curl_getinfo($curlCon, CURLINFO_HTTP_CODE);
            $headerSize = curl_getinfo($curlCon, CURLINFO_HEADER_SIZE);
            $this->lastHeaders = explode("\n", substr($pageContent, 0, $headerSize));
            $body = substr($pageContent, $headerSize);            
            curl_close( $curlCon );
            return $body; //content ready for parsing //
        }
        else{
            $this->lastTransportErrorMessage = $errMsg;
            $this->lastTransportErrorNumber = $errNo;
            curl_close( $curlCon );
            return false;
        }
    }
    
    public function execute($method, $path, $requestData)
    {        
        if(!isset($path)){            
            header("HTTP/1.1 404 Not Found"); die();
        }
        
        $url = $this->config['destination_url'] . $path;
        $headers = $this->getHeaders();        
        $content = $this->grabContent($method, $url, $requestData, $headers);
        if($content === false){
            header("HTTP/1.1 500");
            echo $this->lastTransportErrorNumber . ' ' . $this->lastTransportErrorMessage;
            die();
        }
        foreach ($this->lastHeaders as $header) {
            header($header);
        }        
        echo $content; die();
    }
}
$proxy = new Proxy(require 'config.php');
$proxy->execute($_SERVER['REQUEST_METHOD'], $_GET['path'], file_get_contents('php://input'));
