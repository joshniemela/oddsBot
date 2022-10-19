{
  description = "Python direnv";

  inputs = {
    pypi-deps-db = {
      url = github:DavHau/pypi-deps-db;
      flake = false;
    };
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    mach-nix = {
      url = "github:DavHau/mach-nix";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.pypi-deps-db.follows = "pypi-deps-db";
    };
  };

  outputs = {
    self,
    nixpkgs,
    mach-nix,
    pypi-deps-db
  }: let
    system = "x86_64-linux";
    python = "python310Full";
    pkgs = import nixpkgs {
      inherit system;
      config = {allowUnfree = true;};
    };
    requirements = builtins.readFile ./requirements.txt;
    pythonBuild = mach-nix.lib."${system}".mkPython {
      python="python310Full";
      inherit requirements;
      };
  in {
    packages.${system}.venv = pythonBuild;
    devShell.${system} = pkgs.mkShell {
      buildInputs = [
        pythonBuild
      ];
    };
  };
}
