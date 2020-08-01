/**
 * Get all entries from a Firestore collection
 * @param {CollectionReference} collection A reference to a Firestore collection
 * @return {Promise<Object[]>} An array containing all documents inside the collection
 */
exports.getAll = async (collection) => {
    const documents = await collection.get();
    const snapshots = [];
    documents.forEach(snapshot => {
        snapshots.push({
            id: snapshot.id,
            ...snapshot.data(),
        });
    });

    return snapshots;
}

/**
 * Create an entry in a Firestore collection
 * @param {CollectionReference} collection A reference to a Firestore collection
 * @param {Object} data The data to insert
 * @returns {Promise<DocumentSnapshot>} A snapshot of the created document
 */
exports.create = async (collection, data) => {
    const document = await collection.add(data);
    return document.get();
}

/**
 * Get an entry from the Firestore
 * @param {CollectionReference} collection A reference to a Firestore collection
 * @param {string} id The ID of the document to get
 * @returns {Promise<DocumentSnapshot|undefined>} The document if found, undefined otherwise
 */
exports.get = async (collection, id) => {
    const snapshot = await collection.doc(id).get();
    if (!snapshot.exists) {
        // Document not found
        return undefined;
    }

    return snapshot;
}

/**
 * Update an entry in a Firestore collection
 * @param {CollectionReference} collection A reference to a Firestore collection
 * @param {string} id The ID of the document to update
 * @param {Object} data The data to insert
 * @returns {Promise<DocumentSnapshot|undefined>} The updated document if the write operation was successful, undefined otherwise
 */
exports.update = async (collection, id, data) => {
    await collection.doc(id).update(data);

    return this.get(collection, id);
}

/**
 * Delete an entry from a Firestore collection
 * @param {CollectionReference} collection A reference to a Firestore collection
 * @param {string} id The ID of the document to delete
 * @return {Promise<void>}
 */
exports.delete = async (collection, id) => {
    await collection.doc(id).delete();
}
