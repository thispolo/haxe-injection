package hx.injection.config;

import sys.io.FileOutput;
#if macro
import haxe.macro.Compiler;
import sys.FileSystem;
import haxe.io.Path;
import sys.io.File;
import haxe.macro.Context;

final class ConfigMacro {
    public static function handleDirectory(rootpath : String) : Void {
        var reg = ~/\S/;
        if(!reg.match(rootpath))
            Context.error('Cannot set root path to project root.', Context.currentPos());

        var output = Compiler.getOutput();
        var cwd = Sys.getCwd();
        var source = Path.normalize(Path.join([cwd, rootpath]));

        if(!FileSystem.exists(source))
            Context.error('No such folder \'$rootpath\' in project root.', Context.currentPos());
        
        var destination = Path.normalize(Path.join([cwd, output, rootpath]));

        copy(source, destination);
    }

    private static function copy(source : String, destination : String) : Void {
        if(!FileSystem.exists(destination))
            FileSystem.createDirectory(destination);
        
        var files = FileSystem.readDirectory(source);
        for(file in files) {
            var srcFile = Path.join([source, file]);
            var dstFile = Path.join([destination, file]);
            switch(FileSystem.isDirectory(srcFile)) {
                case true:
                    copy(srcFile, dstFile);
                case false:
                    File.copy(srcFile, dstFile);
            }
        }
    }
}
#end