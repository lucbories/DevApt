<?php

// D:\DATAS\GitHub\DevApt\devapt-server\tests>php ..\dist\mageekguy.atoum.phar -f TestAtoum\tests\units\TestAtoum.php


// La classe de test � son propre namespace :
// Le namespace de la classe � tester + "tests\units"
namespace TestAtoum\tests\units;
 
// Vous devez inclure la classe � tester
require_once __DIR__ . '\..\..\..\TestAtoum\TestAtoum.php';
 
use \atoum;
 
/*
 * Classe de test pour \TestAtoum
 
 * Remarquez qu�elle porte le m�me nom que la classe � tester
 * et qu�elle d�rive de la classe atoum
 */
class TestAtoum extends atoum
{
    /*
     * Cette m�thode est d�di�e � la m�thode getHiAtoum()
     */
    public function testGetHiAtoum ()
    {
        // cr�ation d�une nouvelle instance de la classe � tester
        $helloToTest = new \TestAtoum\TestAtoum();
 
        $this
            // nous testons que la m�thode getHiAtoum retourne bien
            // une cha�ne de caract�re...
            ->string($helloToTest->getHiAtoum())
                // ... et que la cha�ne est bien celle attendue,
                // c�est-�-dire 'Hi atoum !'
                ->isEqualTo('Hi atoum !')
        ;
    }
}