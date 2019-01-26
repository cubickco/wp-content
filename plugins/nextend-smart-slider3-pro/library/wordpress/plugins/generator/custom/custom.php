<?php

N2Loader::import('libraries.plugins.N2SliderGeneratorPluginAbstract', 'smartslider');

class N2SSPluginGeneratorCustom extends N2SliderGeneratorPluginAbstract {

    protected $name = 'custom';
    protected $path;

    function __construct() {
        $this->path = WP_PLUGIN_DIR . DIRECTORY_SEPARATOR . 'smartslidergenerator' . DIRECTORY_SEPARATOR;
    }

    public function getLabel() {
        return 'Custom';
    }

    public function isInstalled() {
        return N2Filesystem::existsFolder($this->path);
    }

    protected function loadSources() {
        $dir = opendir($this->path . 'sources');
        while ($file = readdir($dir)) {
            if ($file == '.' || $file == '..') {
                continue;
            }
            $filename = substr($file, 0, -4);
            $class    = 'N2GeneratorCustom' . $filename;
            new $class($this, $filename, $filename);
        }
        closedir($dir);
    }

    public function getPath() {
        return $this->path;
    }
}

$check = new N2SSPluginGeneratorCustom();
if ($check->isInstalled()) {
    N2SSGeneratorFactory::addGenerator(new N2SSPluginGeneratorCustom);
}
