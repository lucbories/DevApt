ARCHITECTURE
============

What kind of framework ?
Existing principles:

* MVC: Model View Controller.
The View reads datas from the model, the View writes datas
En r�sum�, lorsqu'un client envoie une requ�te � l'application :

la requ�te envoy�e depuis la vue est analys�e par le contr�leur (par exemple un clic de souris pour lancer un traitement de donn�es) ;
le contr�leur demande au mod�le appropri� d'effectuer les traitements et notifie � la vue que la requ�te est trait�e ("via" par exemple un handler ou callback) ;
la vue notifi�e fait une requ�te au mod�le pour se mettre � jour (par exemple affiche le r�sultat du traitement "via" le mod�le).


DEVAPT has some singularities about its architecture.


-- STORAGE ENGINE --
Is a child class of the base STORAGE ENGINE and manage a data source.
Manages CRUD operations on datas.


-- RESULTSET --
An array of object datas read from a STORAGE ENGINE with a query.


-- QUERY --
Has a set of fields.
Has a set of filters.


-- RECORD --
An object of pairs field name / field value.
Has a MODEL.
->update_status()
->free()
->load_from_id(id)
->load(datas)
->save()
->erase()
->set(field name, field value);
->get(field name);


-- RECORDSET --
An array of RECORD read from a MODEL with a QUERY.
Has a QUERY.
Has a MODEL.
Has a set of empty unused RECORDs.
Has a set of RECORDs.
->load(datas)
->read()
->read_all()
->save()
->erase()
->insert(datas)
->append(datas)
->update(datas)
->remove(datas)
->get_by_index(index):Record
->get_by_id(id):Record


-- MODEL --
Read a RESULTSET of datas from a STORAGE ENGINE.
Is unique for a datas schema (a STORAGE ENGINE and a set of FIELDs).


-- VIEW --
Render the content of the view.
Read a set of RECORDs of datas from a VIEW-MODEL.
Update, Delete, Create RECORDs through a VIEW-MODEL.


-- VIEW-MODEL --
Contains business rules on datas (formulas, setters, getters, aliases).
Do actions on VIEW events: select...
