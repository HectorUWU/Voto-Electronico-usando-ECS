/* eslint-disable no-undef */
const Rsa = require('../server/services/Rsa.js');
const llavePrivada = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIJrTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQILz5jALyXnCcCAggA
MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBAjYb9ykmVAnIbM0ZQ2aR5RBIIJ
UORzZXCye/6GHMyQgDmBqgcoqNSAvicuClfXrmlYpY0+f9biTBqHILE/IgyX3Xiq
Jl/zi3TO5wGXZsnZBRx5Hhhs8Q/95d3mz+QkwuCHfv1s1E6cRgh6PvbbAmj57pxQ
yJB78SjZazh4y7QfmVfC8pp89bvAi6N6eJZTHazWvBMrUHZ8BmqYiOcdlbQCGPd+
AFmKMIVBmx1y9IEb/6JRiJk1DeK5mF9QpWPfniixN16/LqT163y8ur8TnH1pVDyb
lDKIwLtZ9LvF/QJCBklejwzpbotIewMGPvDjrHsF4Sapymgz6WgxDK72c2cewkBC
rRxCKDEcm4ZWvw17nKBWRPxMoCiVLMjhu0eSHb6xuUk+R0+BYWkrrIcRpCJm+jYi
/7VXuJODHIQFqTxPDCCgk5C9ugmxGgrsxSeASd6IQ40Dy1XNG3JSdbRxlOp42TF0
Wp7mR5HtTdGvOvaB0L2SIdnRzNWqlLYt7IHTmOCGJRgGALs17hbAkU+SjT1gDS+x
g4K9svT83DtLD69ymzG+EUIAaskvC8HVU8bW9b7SrHY6eetUJTH0mxTlz0QWXRIB
kMhSdi4EbrJLxahoD9rYJ8I3QwRmoI1jZtdUFXqicCpi7m0VnOTQP4auc1ZreyTW
Sv79TBBf0vPCpy8Ach8LHhUWeEmyxfjImUW4hEakXBanHcXdYGXWNXJqAsDPmo4e
9mxYupG7odGzAI+FWK+DpiuNTX518ChyYHnEB1LrLkLJWvRcJOkSMOyoth0vSGOT
B5QipA5DeOWb1+17VK+31GuPeOR0OBu2mf5BJiigRq/tbzVypCaf/4X7n1nAt6Nh
+PETNTSGQeEfypuVNrfbtoK7WHc57S8Zj7H45lgTzcY/L3UVTW0ARx9xHK37z2+u
z1quMO/jX+ev3lT73Itvx8kQrpia3gI3WsNOQFiSPWC7gXwmJfFhRPStgtqIe8De
3W52uqPBwvwMxVO9Sa+X3Iro+bmx8wdWtBtqVFeD9XDjpz+OMiDSshHZe/275Wzp
OgBpG33fFRdPHx4JjZnr1Wk70kgn+zQnDA8glgI2Oisc4hdzkYy5cjz4RaS+AoRT
YpvWNSiAHWaXbokpP9vH+JFnSyv51YASpPlaDS1y9YCqyNoByzkhkc8778oZT5Fy
PjFoM2QdfB+NuCsWQVEAPwa6JLOQBL/JNrGLMLer64QYLIqYVUQXi+uLj7q2V8jB
WANK6H7G25lR2BPt+E1r73rUYdZUFVP89Gcv/qBVfPCp/wuAB0tOvS7Kqgvaj1VW
XzhAJOO1T+mMbPaPiGgHMgM4LchkClcRpD61glH64wF0ppYGMa174VjFxbZO+BTu
ZGqpVcK9jqp7QUrzj+yV43Ea6Ze5EQ4Tym19GyoIU8aDyiEiEqKth3VqNnxvoay/
amoyeuoyfq4wABJOrQBp79++2WOEj9fJB+BnDhlpazsa3TkUrHmrRG5oolKnqjBF
VdbdiJranjCUNeiZTEwnpDCse/V8dwbo12ttt9x7btkD/fxz4IheE1R+fuwEkYOV
Q6fMcbThjn4SN9FV37LAmWHl3zrsRU+oAha0Oo8PteD7mGKjWqedSUIQ//VAwpBT
8GdaeMkMZJOIIrLHB0Ita6ZkhMgB/HPma/TG6l2oHfw+fcWjqj+6maD6A1Muq9ON
uLeW410fNw2dpRvH20XWc2F/Yx6nx9A9LZn0zUteDY/vjO1buuihkjBmyusynsU3
8OMgEp3ZGbQBn46/CZ8DQhQQ+hTJRWR+7dQgwD9sBxV2nEVr41ywqMBAczzjK3+V
MXjHzSIE3mcv2rdY+cMmxK0NX6UoI5fDKf0clwH46G2pjNriO/6qyFo2hUA31mzU
htvRClUtkLen/sk689SmgCVDTlRm6cPsNGb8I9WWneEYx2IMtfcWPgH6YDyz4xMu
78jw3NjbjRsGqHvTY4w/Jp6tlb1K6QnU1ni92VfjVcX453MKzccSPEByBCu634sT
1cEpLDG2pjLMGKDmL35Yq7hPVZ9LVeFuVTBSeMPyyO9R6MGIO5yGvdZE5a51zOnL
haI8MylMymtDFLPc33tLzWFBRKBAG36+TePn5AXG9D1gpHRB7klWripmhbzaJwyn
MTfHW5VzuT1Ndci6rsfew+rE+aH/sCMNG+eVAN9JyfoSxK4imBgeCV7j3YB87GG7
2StrtImRY3GvlyyUsAtkALNlUHWMJusgG1ozAYcZ5FjOBcHbnvfB1AwYyAp/kTas
x4/oSg3yMV4rM+PPvsRXOuvGu6zH2j6lLKfXSTsY5WgOdmx6GsIlXqoZdgLhoXD3
T43myJnfGUORybdUw6mTRf5ILEvwnsoHrdCo+8EIVvlOoolYQExYfRT08RjRMK21
sUpk232gNCXrxQG1FyrxDT6bgTiaopkcIkXJoigIzXb4KVcJ/fXStuXRryjCONQC
4HNwYk2qmBdDPq50OY/VQzpRHgAKTyn+4keB4zLoP5q+xc2PXApoUIRw/6DsXuKk
O+nJWBPsVRFAKyXLO2aAjBNbD1SJKQi4klVMjBmHni9yP6SU7PAUR1MX4sXp2NWs
sewQiY+HiX97WMP9gWG0jvIQah1FC2KuV8G7bZPGzv7SN8ybQiaj3QHE2d8CYN9y
Q6BA7zFslaxS0u2KIZRHprSaGxOWPX+Wvl08KTipn/dHHmmOW8NobdC3WgM/ZR/a
GbccpPWOE4AsIaBjw5Me8eSu5J6CxupVAg8locnc9lB1ecncUvm0jLBiSTkqNBhh
hz3XFiGvTdnO5Xc5cHbnsAFOKv6EwxqLcCQ+PBYemHDSesmwmLzdW5UxaUWlCOLo
SVivXm0aj20TqcWDesWjBBgTamm8CUYDgeWiXlbW+Mm586w7svVWq+GL5Xbi4wDr
D/sA4QJ0HNBZ5ouVvQCTV0zmxWFMXSeXuVyJfhFxnWqRuxXV8APqFIcjxPMPJ8Fv
oh2lU+lAdWgvcmlVYN8J40xnw/ACxQPphx/2wQ9b5swpec8LhgEnNT6LHAjlcrjk
6xLA4iV62wkjMKaiV66h+uVfLLZe8kYS0/QrvkalvLR/8wyPYdrXq9B5pjKFklVR
cWFJVd2hLJ1uL1eRZ7RdfOo/LQNeQxSc4NxHF2agPoLtgKM2zCZfkfb+Sb5anXcp
sHd+dMVCFXCTrKACPh6kzeCMTlZTvpjgIjdhiYNZZyw5
-----END ENCRYPTED PRIVATE KEY-----`

const llavePublica =  `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEArkR+HsM6nCeHsK/HkqW2pSFZwd8zF6X+PpwB4qob4vxh1CtSIij3
8s5jfFSZl+ybeQgGnjPHZDRWPkMTqbfOPyIqzhsSuknY2kPuQkD68t8ly01rrq23
6I0G5R2bSVB0tJz7l266s341MoCrCCED5/vwPHv/J5h7t4yfbjzqIQHwdswuT4dp
F8gkm8PDEfTDK3f9OgVXCG84cU/7e8mi8eNo4b9lac1Q62d5rUIalxPa6WzsLNx8
PFfXjqaFutgLNuwoVQah5gw4Plh0fkwfQ65KeYNbEiqghPTlOqi0NexPyrfZdfP4
cPiJVcAsutbQuOE7xpiSueELTQ58mUl9iMlKSDrB4l6jerrXrULfMyhV8dhZHt/U
tBzd5uMqtc1ew5z0pP47ydmJ9Bw2DisHdJKRXOgwEZherCjI4bIMP7LFcF9hU0mx
+9Vp2GWdaQIOxn4Zo5Tq1p2rFf6YzX7Ih9n4p7qjbeR1pArNSRpShPS079ZMqSji
tGKm1SLzCndx3/xHSYbnpdTMwmqb5BbkJZhJmdGhxqmR+Ffo2gwNT/C9JcGB+DVf
vFqgO6FaTqJegMdcN7+D/vmfpJYkhwGqtmAAq0ECcXHvLboYib8kPAS3oJG8cuTc
kKmwWSWPqToevNAVY8mu3+csMesQcJlMZr93NsRAxY1qiJ+xZEIRw7MCAwEAAQ==
-----END RSA PUBLIC KEY-----`

const rsaCifrar = new Rsa(llavePublica)
test('Ingresar texto my secret data y llave publica debe obtener una longitud de 684', () => {
    expect(rsaCifrar.cifrar(
        'my secret data'
    )).toHaveLength(684);
});

const rsaDescifrar = new Rsa(llavePrivada)
test('Ingresar texto cifrado previamente, llave privada y contrasena top secret debe obtener my secret data', () => {
    expect(rsaDescifrar.descifrar(
        'FmU2LUVXGh5GqytS6DPw9ipUL5Xrs3uMb9OD+OYxZnhxbcDn5gc0jZ48JzUtB/a+60jdLHY5Vi0OIfcn+JZtUBdivLM335/DYrbjsYegENq4Cce42Fyr14fsEVfgK6sTScUZFgzFGzSIWyZZ5H2C5mEZk8CtBdcWyOo4pI0X0FcxaVPko5gDP7mVARjJHaAdnb0pmf72twaBNDW7acXndSdwAWqE01I6Of7MT/HWFEL8PVH+HTpmAVQR97Wt9dFGKPIRrooswZMN0O3k8BNXBeFX+NhXuIo2RcjAZ0I7b1JkANVHZ6RGbKtE34gJ7Y9pvTt8A8648l24RkkvIa+iGgwwQbYonKADBuf6L3o9Ez7rPtS2vpBOUoNvHvziFtee0vH/3Wu2cNawR2w1yPqNsBnCa4Hkv1/IdmbWCDzMBOA+YwxDSfcrvQXyvxSAUSt2W5B42FoW8k5yVfMerDqoyiHqdLBqsPW51v+Ogc7KxWvA3JNirz6CuUIpSXv2QKpOxYDcHFXTlLems3qDLk0pLHuZAFh7Y+AbxWNo9DwO55vpRgBcZ8R9fTRNkzLo2ADGi8yQg1f2uCku5jW8xbtRPfTuLvxsKxWluli1ty+WX2keoP5mGN0VivxSuJ20SIVYiuUIOPCi8sXSxh2xV4jMTuFHt2n4ZFp2ac+Vc/uyL+s=',
        'top secret'
    )).toBe('my secret data');
  });